
window.onload = generateAlbumTable;
const infoDisplay = document.getElementById('album-creation-error');

async function generateAlbumTable() {
    let myTable = document.getElementById('album-table');
    myTable.innerHTML = `
        <tr><th colspan="6">Albums</th></tr>
        <tr>
            <th>Album ID</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Edit</th>
            <th>Delete</th>

        </tr>`;

    const data = await getAlbums()
    data.forEach(element => {
        let newRow = document.createElement("tr");
        Object.values(element).forEach((value) => {
           let cell = document.createElement("td");
           cell.innerText = String(value);
           newRow.appendChild(cell);
        });

        const editAlbum = document.createElement("td")
        editAlbum.innerHTML = `<button type="button" onclick="generateEditAlbumField(this)">Edit</button>`;
        newRow.appendChild(editAlbum);

        const deleteAlbum = document.createElement("td")
        deleteAlbum.innerHTML = `<button type="button" onclick="deleteAlbum(this)">Delete</button>`;
        newRow.appendChild(deleteAlbum);

        myTable.appendChild(newRow);
    });
}


async function deleteAlbum(ele) {
    console.log("delete btn Clicked! ")
    const albumId = ele.parentElement.parentElement.firstChild.textContent;
    console.log(albumId);
    const response = await deleteAlbumData(Number(albumId)); // Convert to number
    const data = await response.json();

    infoDisplay.innerHTML = (response.status !== 200) ? data.error : '';

    await generateAlbumTable();
}

async function createAlbum(){
    let albumTitle = document.getElementById("input-album-title").value
    let albumArtist = document.getElementById("input-album-artist").value
    let albumYear = document.getElementById("input-album-year").value
    
    if (albumTitle != "" && albumArtist != "" && albumYear != null){
        infoDisplay.innerHTML = "Album created!"
        console.log("Album Created!")
        console.log(`Alum name: ${albumTitle}`)
        console.log(`Alum artist: ${albumArtist}`)
        console.log(`Alum year: ${albumYear}`)

        // Create an object with the album data
        const albumBody = {
            title: albumTitle,
            artist: albumArtist,
            year: albumYear
        };

         // postAlbum function with the album data
         const response = await postAlbum(albumBody);
         if (response.status === 201) {
            console.log("Album successfully created!");
            
            //update render state of the albums list on the screen 
            await generateAlbumTable();

        } else {
            const data = await response.json();
            infoDisplay.innerHTML = data.error || "Error creating the album.";
            console.error("Error creating the album:", data.error || response.statusText);
        }

        //clear input fields after creating the album
        document.getElementById("input-album-title").value = "";
        document.getElementById("input-album-artist").value = "";
        document.getElementById("input-album-year").value = "";

    }
    else{
        infoDisplay.innerHTML = "Please fill in all fields"
    }
}

//--------------controllers--------------
async function getAlbums() {
    return await fetch('api/albums/')
        .then(response => response.json());
}

async function deleteAlbumData(albumId) {
    return await fetch(`api/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

async function postAlbum(albumBody){
    return await fetch(`api/albums/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(albumBody)
    });
}