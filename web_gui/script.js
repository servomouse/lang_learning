/* ==========================================
   1. UI NAVIGATION & RESPONSIVE LOGIC
   ========================================== */
const menuToggle = document.getElementById('menuToggle');
const navContainer = document.getElementById('navContainer');
const mainContainer = document.getElementById('mainContainer');

menuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
});

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        const layoutHeight = window.innerHeight;
        const visibleHeight = window.visualViewport.height;
        
        if (visibleHeight < layoutHeight) {
            const offset = (layoutHeight - visibleHeight) * 0.5; 
            mainContainer.style.setProperty('--keyboard-offset', `-${offset}px`);
        } else {
            mainContainer.style.setProperty('--keyboard-offset', '0px');
        }
    });
}

/* ==========================================
   2. BACKEND INTEGRATION LOGIC
   ========================================== */

// Helper to handle requests to the Flask server and update DOM text with highlights
async function fetchCardContent(processAnswer = false) {
    const textWrapField = document.getElementById('textWrapField');
    const menu1 = document.getElementById('menu1').value;
    const menu2 = document.getElementById('menu2').value;
    const cardInput = document.getElementById('cardInput').value;

    // Build payload mapping layout specs
    const payload = {
        "answer": cardInput,
        "menu1_val": menu1,
        "menu2_val": menu2,
        "process_answer": processAnswer
    };

    try {
        const response = await fetch('/get-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network response error');

        const data = await response.json();
        
        let dynamicText = data.text;
        const targetHighlight = data.highlight;

        // Inline text regex matching to turn target word into a highlighted span element
        if (targetHighlight && dynamicText.includes(targetHighlight)) {
            const regex = new RegExp(`\\b(${targetHighlight})\\b`, 'g');
            dynamicText = dynamicText.replace(regex, `<span class="highlight">$1</span>`);
        }

        // Render string containing highlights securely
        textWrapField.innerHTML = dynamicText;

    } catch (error) {
        console.error('Error fetching backend data:', error);
        textWrapField.textContent = "Failed to load content from server.";
    }
}

// Trigger initial content request load when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchCardContent(false);
});


/* ==========================================
   3. INTERACTIVE CALLBACK FUNCTIONS
   ========================================== */

// Dropdown Menus Local Callbacks
document.getElementById('menu1').addEventListener('change', (event) => {
    console.log(`Menu Alpha altered locally: ${event.target.value}`);
});

document.getElementById('menu2').addEventListener('change', (event) => {
    console.log(`Menu Beta altered locally: ${event.target.value}`);
});

// Header Submit Button Callback
document.getElementById('headerBtn').addEventListener('click', () => {
    alert('Header Submit action triggered!');
});

// Card Save Button Callback -> Triggers fetch with process_answer: true
document.getElementById('saveBtn').addEventListener('click', () => {
    console.log('Save triggered. Requesting data update...');
    fetchCardContent(true);
});

// Card Cancel Button Callback -> Triggers fetch with process_answer: false
document.getElementById('cancelBtn').addEventListener('click', () => {
    console.log('Cancel triggered. Resetting target value and reloading text...');
    document.getElementById('cardInput').value = '';
    fetchCardContent(false);
});