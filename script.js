document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const generateBtn = document.getElementById("generateBtn");
  const certificateWrapper = document.getElementById("certificateWrapper");
  const participantName = document.getElementById("participantName");
  const loadingText = document.getElementById("loadingText");
  const downloadCount = document.getElementById("downloadCount");

 
  const scriptURL = "https://script.google.com/macros/s/AKfycbzdINVsQpTdE27ikAn6TIoPPmatjW6qa6O4HOHWDogjA3BBXqKGu2_q8gPo_CawlcOU/exec";


  fetch(scriptURL)
    .then(response => response.text())
    .then(count => {
      downloadCount.textContent = `Total Downloads: ${count}`;
    })
    .catch(err => console.error("Error fetching count:", err));

  
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z.\s]/g, "");
    nameInput.value = nameInput.value.toUpperCase();
    nameInput.value = nameInput.value.replace(/\s{2,}/g, " ");
  });

  generateBtn.addEventListener("click", async () => {
    const nameValue = nameInput.value.trim();

    if (!nameValue) {
      alert("Please enter your name.");
      return;
    }

    participantName.textContent = nameValue;
    certificateWrapper.classList.remove("hidden");

    loadingText.classList.remove("hidden");
    generateBtn.disabled = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(document.getElementById("certificateContainer"), {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("l", "mm", "a4");

      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const position = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save(`${nameValue}_Certificate.pdf`);

      
      fetch(scriptURL, { method: "POST" })
        .then(response => response.text())
        .then(count => {
          downloadCount.textContent = `Total Downloads: ${count}`;
        })
        .catch(err => console.error("Error updating download count:", err));

    } catch (err) {
      console.error(err);
      alert("Error generating certificate. Please try again.");
    } finally {
      loadingText.classList.add("hidden");
      generateBtn.disabled = false;
    }
  });
});

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
  if (
    event.key === 'F12' ||
    (event.ctrlKey && event.shiftKey && ['I', 'C', 'J'].includes(event.key.toUpperCase())) ||
    (event.ctrlKey && event.key.toUpperCase() === 'U') ||
    (event.ctrlKey && event.key.toUpperCase() === 'S')
  ) {
    event.preventDefault();
    alert("Developer tools are disabled on this page.");
  }
});
