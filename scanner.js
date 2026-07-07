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

        name: name,
        address: address,
        cell: cell,
        email: email,

        date: now.toLocaleDateString(),

        time: now.toLocaleTimeString()

    });

    localStorage.setItem("scanRecords", JSON.stringify(records));

}

function onScanSuccess(decodedText){

    document.getElementById("result").value = decodedText;

    saveScanRecord(decodedText);

    html5QrCode.stop();

    alert("QR Code scanned successfully!");

}

const html5QrCode = new Html5Qrcode("reader");

function startScanner(){

    // Prefer the back camera on mobile devices
    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },

        onScanSuccess

    ).catch(() => {

        // If no back camera is available,
        // use the first detected camera.

        Html5Qrcode.getCameras().then(cameras => {

            if(cameras.length){

                html5QrCode.start(

                    cameras[0].id,

                    {
                        fps:10,
                        qrbox:250
                    },

                    onScanSuccess

                );

            }else{

                alert("No camera found.");

            }

        });

    });

}

startScanner();
