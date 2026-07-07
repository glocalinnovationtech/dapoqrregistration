// Prevent multiple scans
let scanned = false;

// QR Code Scanner
const html5QrCode = new Html5Qrcode("reader");

// Save scanned record
function saveScanRecord(decodedText){

    let name = "";
    let address = "";
    let cell = "";
    let email = "";

    decodedText.split("\n").forEach(line => {

        if(line.startsWith("Name:"))
            name = line.replace("Name:", "").trim();

        if(line.startsWith("Address:"))
            address = line.replace("Address:", "").trim();

        if(line.startsWith("Cell:"))
            cell = line.replace("Cell:", "").trim();

        if(line.startsWith("Email:"))
            email = line.replace("Email:", "").trim();

    });

    const now = new Date();

    let records = JSON.parse(localStorage.getItem("scanRecords")) || [];

    records.push({

        name,
        address,
        cell,
        email,

        date: now.toLocaleDateString(),

        time: now.toLocaleTimeString()

    });

    localStorage.setItem("scanRecords", JSON.stringify(records));

    console.log("Record saved successfully.");
}

// Called when QR is detected
function onScanSuccess(decodedText){

    // Prevent duplicate scans
    if(scanned) return;

    scanned = true;

    console.log("QR Code Detected:");
    console.log(decodedText);

    if(!decodedText){

        alert("QR Code contains no data.");

        scanned = false;

        return;

    }

    // Display scanned data
    const resultBox = document.getElementById("result");

    if(resultBox){

        resultBox.value = decodedText;

    }else{

        console.warn("Result textbox (#result) was not found.");

    }

    // Save to Local Storage
    saveScanRecord(decodedText);

    // Stop scanner safely
    html5QrCode.stop()
    .then(() => {

        console.log("Scanner stopped.");

        alert("QR Code scanned successfully!");

    })
    .catch(err => {

        console.error("Unable to stop scanner:", err);

    });

}

// Scanner errors (ignored to avoid console spam)
function onScanFailure(error){
    // Uncomment below for debugging
    // console.warn(error);
}

// Start camera
function startScanner(){

    html5QrCode.start(

        {
            facingMode: {
                ideal: "environment"
            }
        },

        {
            fps:10,
            qrbox:250
        },

        onScanSuccess,
        onScanFailure

    ).catch(err => {

        console.warn("Back camera unavailable:", err);

        // Fallback to available cameras
        Html5Qrcode.getCameras().then(cameras => {

            if(cameras && cameras.length > 0){

                console.log("Using camera:", cameras[0].label);

                html5QrCode.start(

                    cameras[0].id,

                    {
                        fps:10,
                        qrbox:250
                    },

                    onScanSuccess,
                    onScanFailure

                );

            }else{

                alert("No camera found.");

            }

        }).catch(error => {

            console.error(error);

            alert("Unable to access the camera.");

        });

    });

}

// Start scanning
startScanner();
