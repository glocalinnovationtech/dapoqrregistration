// Start QR Scanner

function onScanSuccess(decodedText) {

    // Display scanned text
    document.getElementById("result").value = decodedText;

    // Split QR data into lines
    const lines = decodedText.split("\n");

    let name = "";
    let address = "";
    let cell = "";
    let email = "";

    // Extract information
    lines.forEach(line => {

        if(line.startsWith("Name:")){
            name = line.replace("Name:","").trim();
        }

        if(line.startsWith("Address:")){
            address = line.replace("Address:","").trim();
        }

        if(line.startsWith("Cell:")){
            cell = line.replace("Cell:","").trim();
        }

        if(line.startsWith("Email:")){
            email = line.replace("Email:","").trim();
        }

    });

    // Current Date & Time
    const now = new Date();

    const date = now.toLocaleDateString("en-US",{
        year:"numeric",
        month:"long",
        day:"numeric"
    });

    const time = now.toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true
    });

    // Load existing records
    let scanRecords =
        JSON.parse(localStorage.getItem("scanRecords")) || [];

    // Prevent duplicate scans
    const duplicate = scanRecords.some(record =>
        record.name === name &&
        record.address === address &&
        record.cell === cell &&
        record.email === email
    );

    if(!duplicate){

        scanRecords.push({

            name: name,
            address: address,
            cell: cell,
            email: email,
            date: date,
            time: time

        });

        localStorage.setItem(
            "scanRecords",
            JSON.stringify(scanRecords)
        );

        alert("QR Code scanned successfully!");

    }

    // Stop scanning after successful scan
    html5QrCode.stop();

}

// Camera Error
function onScanFailure(error){
    // Ignore continuous scan errors
}

// Initialize Scanner
const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(cameras => {

    if(cameras && cameras.length){

        html5QrCode.start(

            cameras[0].id,

            {
                fps:10,
                qrbox:{
                    width:250,
                    height:250
                }
            },

            onScanSuccess,

            onScanFailure

        );

    }

}).catch(err => {

    alert("Unable to access the camera.\n\n" + err);

});
