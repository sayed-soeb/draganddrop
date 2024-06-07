document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    // Load saved images from local storage
    loadImages();

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        if (files.length + fileList.children.length > 5) {
            alert('You can upload a maximum of 5 images.');
            return;
        }

        for (const file of files) {
            if (file.size > 1048576) {
                alert('File size must be below 1 MB.');
                continue;
            }
            const reader = new FileReader();
            reader.onload = () => {
                addImage(file.name, reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function addImage(name, src) {
        const div = document.createElement('div');
        div.className = 'file-item';

        const img = document.createElement('img');
        img.src = src;

        const textarea = document.createElement('textarea');
        textarea.placeholder = "Add a description";

        const actions = document.createElement('div');
        actions.className = 'actions';

        const checkBtn = document.createElement('button');
        checkBtn.className = 'check';
        checkBtn.innerHTML = '✔';
        checkBtn.addEventListener('click', () => {
            if (textarea.value.trim() === '') {
                alert('Please add a description before saving.');
                return;
            }
            textarea.disabled = true;
            saveImages();
            alert('Description has been added.');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.innerHTML = '✖';
        deleteBtn.addEventListener('click', () => {
            fileList.removeChild(div);
            saveImages();
        });

        actions.appendChild(checkBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(img);
        div.appendChild(textarea);
        div.appendChild(actions);

        fileList.appendChild(div);

        saveImages();
    }

    function saveImages() {
        const items = [];
        for (const item of fileList.children) {
            const img = item.querySelector('img').src;
            const description = item.querySelector('textarea').value;
            items.push({ img, description });
        }
        localStorage.setItem('images', JSON.stringify(items));
    }

    function loadImages() {
        const items = JSON.parse(localStorage.getItem('images')) || [];
        for (const { img, description } of items) {
            addImageFromStorage(img, description);
        }
    }

    function addImageFromStorage(src, description) {
        const div = document.createElement('div');
        div.className = 'file-item';

        const img = document.createElement('img');
        img.src = src;

        const textarea = document.createElement('textarea');
        textarea.placeholder = "Add a description";
        textarea.value = description || "";
        textarea.disabled = true;

        const actions = document.createElement('div');
        actions.className = 'actions';

        const checkBtn = document.createElement('button');
        checkBtn.className = 'check';
        checkBtn.innerHTML = '✔';
        checkBtn.disabled = true;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.innerHTML = '✖';
        deleteBtn.addEventListener('click', () => {
            fileList.removeChild(div);
            saveImages();
        });

        actions.appendChild(checkBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(img);
        div.appendChild(textarea);
        div.appendChild(actions);

        fileList.appendChild(div);
    }
});
