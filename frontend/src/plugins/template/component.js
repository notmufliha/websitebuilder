export default (editor, opts = {}) => {
    // Detect when a component is added to the editor
    editor.on('component:add', (component) => {
        // Check if the component matches your custom component
        if (isCustomComponent(component)) {
            const componentContent = component.toHTML(); // Example: for HTML content

            console.log(editor);
            console.log(opts);
            console.log(component);
            console.log(componentContent);
            // const newContent = '<p>This is a trial content.</p>'; // Example new content
            // component.replaceWith(newContent);
            // // Open modal for your custom component
            openModal(component);
        }
    });

    // Function to check if a component is your custom component
    const isCustomComponent = (component) => {
        return component.get('type') === 'cswiper2';
    };

    // Function to open modal for your custom component
    const openModal = (component) => {
        const modal = editor.Modal;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.innerHTML = `
            <div style="padding: 20px;">
                <h3>Select GitHub Repository</h3>
                <input type="text" placeholder="Enter GitHub repository URL">
                <button id="selectBtn">Select</button>
            </div>
        `;

        // Add event listener to select button
        const selectBtn = modalContent.querySelector('#selectBtn');
        selectBtn.addEventListener('click', handleSelect(component));

        // Open modal
        modal.open({
            title: 'Select GitHub Repository',
            content: modalContent,
        });
    };

    const preDefinedRepoURL = "https://github.com/notmufliha/websiteC";

    const handleSelect = async (component) => {
        const accessToken = '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';
        const urlParts = preDefinedRepoURL.split('/');
        const owner = urlParts[urlParts.length - 2];
        const repo = urlParts[urlParts.length - 1];

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/freebies`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch folder contents');
            }
            const data = await response.json();

            // Array to store all promises
            const promises = [];

            // Array to store all modal contents
            const modalContents = [];

            for (const item of data) {
                if (item.type === 'dir') {
                    const promise = fetch(item.url, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                        .then(subfolderResponse => {
                            if (!subfolderResponse.ok) {
                                throw new Error('Failed to fetch subfolder contents');
                            }
                            return subfolderResponse.json();
                        })
                        .then(subfolderData => {
                            const htmlFiles = subfolderData.filter(file => file.name.endsWith('.html'));
                            const modalContent = document.createElement('div');
                            modalContent.innerHTML += `<h3>${item.name}</h3>`;
                            htmlFiles.forEach(htmlFile => {
                                const box = document.createElement('div');
                                box.classList.add('html-file-box');
                                box.textContent = htmlFile.name;
                                box.setAttribute('data-url', htmlFile.download_url);
                                modalContent.appendChild(box);
                            });
                            modalContents.push(modalContent);
                        })
                        .catch(error => {
                            console.error('Error fetching subfolder contents:', error);
                        });

                    promises.push(promise);
                }
            }

            // Wait for all promises to resolve
            await Promise.all(promises);

            // Set modal content after all promises have resolved
            const combinedContent = document.createElement('div');
            modalContents.forEach(content => {
                combinedContent.appendChild(content);
            });
            editor.Modal.setContent(combinedContent);

            // Add event listener to modal content to handle component replacement
            const htmlFileBoxes = combinedContent.querySelectorAll('.html-file-box');
            htmlFileBoxes.forEach(htmlFileBox => {
                htmlFileBox.addEventListener('click', async () => {
                    // Get the URL of the selected HTML file
                    console.log(htmlFileBox)
                    const htmlFileURL = htmlFileBox.getAttribute('data-url');

                    try {
                        const response = await fetch(`http://localhost:3002/fetch-data`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch folder contents');
            }

            const txt = response
            console.log(response)
                        
                              const newContent = '<p>This is a trial content.</p>'; // Example new content
                              component.replaceWith(newContent);
                            // Close the modal
                            editor.Modal.close();
                        
        
                    } catch (error) {
                        console.error('Error fetching HTML file:', error);
                        alert('Error fetching HTML file. Please try again.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching repository contents:', error);
            alert('Error fetching repository contents. Please check the repository URL and try again.');
        }
    };
};









// export default (editor, opts = {}) => {

//     // Detect when a component is added to the editor
//     editor.on('component:add', (component) => {
//         console.log(editor)
//         console.log(opts)
//         console.log(component)
//         // Check if the component matches your custom component
//         if (isCustomComponent(component)) {
//             console.log(isCustomComponent(component))
//             // Open modal for your custom component
//             openModal();
//         }
//     });

//     // Function to check if a component is your custom component
//     const isCustomComponent = (component) => {
//         console.log(component)
//         return component.get('type') === 'cswiper2';
//     };

//     // Function to open modal for your custom component
//     const openModal = () => {
//         const modal = editor.Modal;

//         // Create modal content
//         const modalContent = document.createElement('div');
//         modalContent.innerHTML = `
//             <div style="padding: 20px;">
//                 <h3>Select GitHub Repository</h3>
//                 <input type="text" placeholder="Enter GitHub repository URL">
//                 <button id="selectBtn">Select</button>
//             </div>
//         `;

//         // Add event listener to select button
//         const selectBtn = modalContent.querySelector('#selectBtn');
//         selectBtn.addEventListener('click', handleSelect);

//         // Open modal
//         modal.open({
//             title: 'Select GitHub Repository',
//             content: modalContent,
//         });
//     };

//     const preDefinedRepoURL = "https://github.com/notmufliha/websiteC";


//     const handleSelect = async () => {
//         const accessToken = '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';
//         const urlParts = preDefinedRepoURL.split('/');
//         const owner = urlParts[urlParts.length - 2];
//         const repo = urlParts[urlParts.length - 1];

//         try {
//             const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/freebies`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch folder contents');
//             }
//             const data = await response.json();
            

//             // Array to store all promises
//             const promises = [];

//             // Array to store all modal contents
//             const modalContents = [];

//             for (const item of data) {
//                 if (item.type === 'dir') {
//                     const promise = fetch(item.url, {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`
//                         }
//                     })
//                         .then(subfolderResponse => {
//                             if (!subfolderResponse.ok) {
//                                 throw new Error('Failed to fetch subfolder contents');
//                             }
//                             return subfolderResponse.json();
//                         })
//                         .then(subfolderData => {
//                             const htmlFiles = subfolderData.filter(file => file.name.endsWith('.html'));
//                             const modalContent = document.createElement('div');
//                             modalContent.innerHTML += `<h3>${item.name}</h3>`;
//                             htmlFiles.forEach(htmlFile => {
//                                 const box = document.createElement('div');
//                                 box.classList.add('html-file-box');
//                                 box.textContent = htmlFile.name;
//                                 box.addEventListener('click', () => {
//                                     window.open(htmlFile.download_url, '_blank');
//                                 });
//                                 modalContent.appendChild(box);
//                             });
//                             modalContents.push(modalContent);
//                         })
//                         .catch(error => {
//                             console.error('Error fetching subfolder contents:', error);
//                         });

//                     promises.push(promise);
//                 }
//             }

//             // Wait for all promises to resolve
//             await Promise.all(promises);

//             // Set modal content after all promises have resolved
//             const combinedContent = document.createElement('div');
//             modalContents.forEach(content => {
//                 combinedContent.appendChild(content);
//             });
//             editor.Modal.setContent(combinedContent);
//         } catch (error) {
//             console.error('Error fetching repository contents:', error);
//             alert('Error fetching repository contents. Please check the repository URL and try again.');
//         }
//     };

// };