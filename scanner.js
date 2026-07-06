function onScanSuccess(decodedText){

    document.getElementById("result").value = decodedText;
    
    // Save scanned record
    let scans = JSON.parse(localStorage.getItem("scanRecords")) || [];
    
    scans.push({
    
    date:new Date().toLocaleString(),
    
    data:decodedText
    
    });
    
    localStorage.setItem("scanRecords",JSON.stringify(scans));
    
    }
    
    let html5QrcodeScanner = new Html5QrcodeScanner(
    
    "reader",
    
    {
    
    fps:10,
    
    qrbox:250
    
    }
    
    );
    
    html5QrcodeScanner.render(onScanSuccess);