document.addEventListener('DOMContentLoaded', function() {
    let activeInput = null;

    // Set the active input field when focused
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('focus', function() {
            activeInput = this;
        });
    });

    // Handle key press events for the keypad
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            if (activeInput) {
                let value = this.getAttribute('data-value');
                if (isNaN(value)) {
                    activeInput.value += ' ' + value + ' ';
                } else {
                    activeInput.value += value;
                }
            }
        });
    });

    // Handle delete button click
    document.querySelector('.delete').addEventListener('click', function() {
        if (activeInput) {
            let parts = activeInput.value.trim().split(' ');
            parts.pop();
            activeInput.value = parts.join(' ') + (parts.length ? ' ' : '');
        }
    });

    // Handle clear button click
    document.querySelector('.clear').addEventListener('click', function() {
        if (activeInput) {
            activeInput.value = '';
        }
    });

    // Handle print button click
    document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
        event.preventDefault();

        // Check if any item is checked but quantity is not given
        const uncheckedItems = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .filter(checkbox => {
                const quantityInput = checkbox.parentNode.querySelector('input[type="text"]');
                return !quantityInput.value.trim();
            });

        // Check if no item is selected
        const noItemsSelected = document.querySelectorAll('input[type="checkbox"]:checked').length === 0;

        if (uncheckedItems.length > 0) {
            alert("Please enter quantity for all checked items.");
        } else if (noItemsSelected) {
            alert("Please select at least one item to download.");
        } else {
            const checkedItems = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => {
                    const quantityInput = checkbox.parentNode.querySelector('input[type="text"]');
                    return `${checkbox.getAttribute('data-label')} : ${quantityInput.value.trim()}`;
                });

            // Create HTML content
            let htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Grocery List</title>
                    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: "Noto Sans Telugu", sans-serif;
                            margin: 0;
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                            font-size: 2rem;
                            margin-bottom: 20px;
                            text-decoration: underline;
                        }
                        .items {
                            font-size: 18px;
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            gap: 20px;
                        }
                        .item {
                            width: calc(33.333% - 20px);
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">List</div>
                    <div class="items">
                        ${checkedItems.map(item => `<div class="item">${item}</div>`).join('')}
                    </div>
                </body>
                </html>
            `;

            // Create Blob from HTML content
            let blob = new Blob([htmlContent], { type: 'text/html' });

            // Create a link element and trigger download
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Grocery_List.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Open the downloaded file in a new tab
            let newTab = window.open();
            newTab.document.write(htmlContent);
            newTab.document.close();

            alert("Downloaded Successfully");
        }
    });
});
