// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Simple calculator logic
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('metersContainer');
    const addMeterButton = document.getElementById('addMeter');
    const calculateButton = document.getElementById('calculate');
    const resultDiv = document.getElementById('result');

    // Load stored meter data or initialize as empty array
    let meters = JSON.parse(localStorage.getItem('meters')) || [];

    // Function to save meters to localStorage
    function saveMeters() {
        localStorage.setItem('meters', JSON.stringify(meters));
    }

    // Function to render meter input fields
    function renderMeters() {
        container.innerHTML = '';
        meters.forEach((meter, index) => {
            const meterDiv = document.createElement('div');
            meterDiv.classList.add('meter');

            meterDiv.innerHTML = `
          <input type="number" id="lastReading-${index}" placeholder="Last Reading" value="${meter.lastReading || ''}">
          <input type="number" id="currentReading-${index}" placeholder="Current Reading" value="${meter.currentReading || ''}">
          <button class="deleteMeter" data-index="${index}">Delete</button>
        `;
            container.appendChild(meterDiv);
        });
    }

    // Render meters on page load
    renderMeters();

    // Add a new meter
    addMeterButton.addEventListener('click', () => {
        meters.push({ lastReading: '', currentReading: '' });
        renderMeters();
        saveMeters();
    });

    // Delegate delete button events
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteMeter')) {
            const index = event.target.getAttribute('data-index');
            // Remove meter at the specified index
            meters.splice(index, 1);
            renderMeters();
            saveMeters();
        }
    });

    // Calculate units per meter and total units
    calculateButton.addEventListener('click', () => {
        // Update meter values from the input fields
        meters = meters.map((meter, index) => ({
            lastReading: document.getElementById(`lastReading-${index}`).value,
            currentReading: document.getElementById(`currentReading-${index}`).value
        }));
        saveMeters();

        let totalUnits = 0;
        let outputHtml = '';

        meters.forEach((meter, index) => {
            const last = parseFloat(meter.lastReading);
            const current = parseFloat(meter.currentReading);
            if (!isNaN(last) && !isNaN(current) && current >= last) {
                const unitsUsed = current - last;
                totalUnits += unitsUsed;
                outputHtml += `<p>Meter ${index + 1}: ${unitsUsed} unit(s)</p>`;
            } else {
                outputHtml += `<p>Meter ${index + 1}: Invalid input</p>`;
            }
        });

        outputHtml += `<hr><p><strong>Total Units Used: ${totalUnits}</strong></p>`;
        resultDiv.innerHTML = outputHtml;
    });
});


