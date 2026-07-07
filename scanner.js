// =============================
// DAPO QR Scanner
// scanner.js
// =============================

function onScanSuccess(decodedText) {

    // Display scanned QR
    document.getElementById("result").value = decodedText;

    // Stop scanning after successful scan
    html5QrCode.stop();

    // Split QR data into lines
    let lines = decodedText.split("\n");

    let data = {
        name: "",
        address: "",
        cell: "",
        email: ""
    };

    lines.forEach(line => {

        if(line.startsWith("Name:"))
            data.name = line.replace("Name:", "").trim();

        if(line.startsWith("Address:"))
            data.address = line.replace("Address:", "").trim();

        if(line.startsWith("Cell:"))
            data.cell = line.replace("Cell:", "").trim();

        if(line.startsWith("Email:"))
            data.email = line.replace("Email:", "").trim();

    });

    const now = new Date();

    data.date = now.toLocaleDateString();
    data.time = now.toLocaleTimeString();

    // Save scanned record
    let scans = JSON.parse(localStorage.getItem("scanRecords")) || [];

    scans.push(data);

    localStorage.setItem("scanRecords", JSON.stringify(scans));

    alert("QR Code scanned successfully!");
}

const html5QrCode = new Html5Qrcode("reader");

// =====================================
// Use BACK camera on phones
// =====================================

Html5Qrcode.getCameras()
.then(devices => {

    if(!devices || devices.length === 0){
        alert("No camera detected.");
        return;
    }

    // Try to find the back camera
    let backCamera = devices.find(device => {

        const label = device.label.toLowerCase();

        return label.includes("back") ||
               label.includes("rear") ||
               label.includes("environment");

    });

    const cameraId = backCamera
        ? backCamera.id
        : devices[0].id;

    html5QrCode.start(

            { facingMode: "environment" },
        
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
        
            onScanSuccess
        
    );

})
.catch(err => {

    console.log(err);

    alert("Unable to access the camera.");

});
