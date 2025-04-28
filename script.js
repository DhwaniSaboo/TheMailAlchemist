function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}


const fileInput = document.getElementById('csvFile');
const fileNameDisplay = document.getElementById('file-name');

fileInput.addEventListener('change', function () {
  if (this.files.length > 0) {
    fileNameDisplay.textContent = this.files[0].name;
  } else {
    fileNameDisplay.textContent = 'No file chosen';
  }
});
 

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(card => {
  observer.observe(card);
});


document.getElementById("emailForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    
    const fileInput = document.getElementById("csvFile");
    const message = document.getElementById("message").value;
    const output = document.getElementById("output");
    const subject = document.getElementById("subject").value;
  
    // Check if a CSV file is uploaded
    if (!fileInput.files.length) {
      output.textContent = "Please upload a CSV file.";
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = async function (event) {
      const csvText = event.target.result;
      const lines = csvText.trim().split("\n");
  
      // Check if the CSV file contains any data
      if (lines.length < 2) {
        output.textContent = "CSV file is empty or missing data.";
        return;
      }
  
      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const rawEmails = lines.slice(1).map(line => line.trim());
      const validEmails = rawEmails.filter(email => emailRegex.test(email));
      console.log("Valid Emails:", validEmails);
      // If no valid emails, show an error message
      if (validEmails.length === 0) {
        output.textContent = "Error: No valid emails found in CSV.";
        return;
      }
  
      // Show the number of emails that will be sent
      output.textContent = `📤 Sending emails to ${validEmails.length} recipient(s)...`;
  
      try {
        // Make the POST request to your server to send the emails
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: validEmails,  // Send the valid emails list to the backend
            subject: subject,  // Add a subject
            html: message,  // The message will be the HTML content of the email
          }),
        });
  

        if (response.ok) {
          const result = await response.json();
          output.textContent = "✅ Emails sent successfully!";
        } else {
          const errorResult = await response.json();
          output.textContent = `❌ Error: ${errorResult.message || "Failed to send emails"}`;        }
      } catch (error) {
        output.textContent = "❌ Error sending emails.";
        console.error("Frontend error:",error);
      }
    };
  
    reader.readAsText(file);  // Read the uploaded file as text
});

document.addEventListener('mousemove', function(e) {
  const particle = document.createElement('div');
  particle.classList.add('magic-particle');
  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;
  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 2000); // Remove after 2 seconds
});

document.getElementById('templates').addEventListener('change', function() {
  const messageBox = document.getElementById('message');
  const selectedTemplate = this.value;

  switch (selectedTemplate) {
    case 'event':
      messageBox.value = "You're invited! 🎉\nJoin us for an unforgettable event. RSVP today!";
      break;
    case 'sale':
      messageBox.value = "Big Sale Alert! 🛒\nEnjoy massive discounts for a limited time only.";
      break;
    case 'newsletter':
      messageBox.value = "Welcome to our Monthly Newsletter! 📝\nHere's what's new and exciting.";
      break;
    case 'product':
      messageBox.value = "Introducing Our New Product! 📣\nBe the first to experience innovation.";
      break;
    case 'reminder':
      messageBox.value = "Just a friendly reminder 📬\nDon't forget about our upcoming event.";
      break;
    default:
      messageBox.value = "";
  }
});

function openMenu() {
  document.getElementById("side-panel").style.width = "250px";
}

function closeMenu() {
  document.getElementById("side-panel").style.width = "0";
}
