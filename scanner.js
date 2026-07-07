function onScanSuccess(decodedText) {

    // Show scanned result
    document.getElementById("result").value = decodedText;

    // Get existing scan records
    let records = JSON.parse(localStorage.getItem("scanRecords")) || [];

    // Current date & time
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    // Default values
    let name = "";
    let address = "";
    let cell = "";
    let email = "";

    // Split QR data into lines
    const lines = decodedText.split("\n");

    lines.forEach(line => {

        if(line.startsWith("Name:"))
            name = line.replace("Name:", "").trim();

        if(line.startsWith("Address:"))
            address = line.replace("Address:", "").trim();

        if(line.startsWith("Cell:"))
            cell = line.replace("Cell:", "").trim();

        if(line.startsWith("Email:"))
            email = line.replace("Email:", "").trim();

    });

    // Avoid duplicate consecutive scans
    if(records.length > 0){

        const last = records[records.length - 1];

        if(last.rawData === decodedText){
            return;
        }

    }

    // Save record
    records.push({

        name: name,
        address: address,
        cell: cell,
        email: email,
        rawData: decodedText,
        date: date,
        time: time

    });

    localStorage.setItem("scanRecords", JSON.stringify(records));

}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras()
.then(devices => {

    if(devices.length){

        html5QrCode.start(

            devices[0].id,

            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },

            onScanSuccess

        );

    }else{

        alert("No camera found.");

    }

})
.catch(err => {

    console.error(err);

    alert("Unable to access camera.");

});
