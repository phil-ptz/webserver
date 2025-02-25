// Skript für trainingsplan.html
// Zeigt die Videos, je nach Auswahl an.

document.addEventListener('DOMContentLoaded', function() {
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const locationInputs = document.querySelectorAll('input[name="location"]');

    // Stelle sicher, dass nur eine Option in den oberen drei Spalten ausgewählt werden kann
    categoryInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Deaktiviere alle anderen Radio-Buttons in den oberen drei Spalten
            categoryInputs.forEach(otherInput => {
                if (otherInput !== this) {
                    otherInput.checked = false;
                }
            });
        });
    });

    // Event-Listener für den Button "Videos anzeigen"
    document.getElementById('showVideos').addEventListener('click', function() {
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const selectedLocation = document.querySelector('input[name="location"]:checked').value;

        // Video-Datenbank
        const videos = {
            // Ganzkörper
            'https://www.youtube.com/embed/T2lyoAhcnXI': ['Ganzkörper', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/aDVz9F7azmk': ['Ganzkörper', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/IffvFfniORk': ['Ganzkörper', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/67c-Z2wOXhc': ['Ganzkörper', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/8jXcpuNZ56E': ['Ganzkörper', 'Fitnessstudio'],
            'https://www.youtube.com/embed/eMjyvIQbn9M': ['Ganzkörper', 'Fitnessstudio'],
            'https://www.youtube.com/embed/B12MXF0bSFo': ['Ganzkörper', 'Fitnessstudio'],

            // Oberkörper
            'https://www.youtube.com/embed/qGCCVFrsN0Y': ['Oberkörper', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/b9yuPjHegjQ': ['Oberkörper', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/W7xtSKhb6jk': ['Oberkörper', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/owjJHcFE4b0': ['Oberkörper', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/fJQmoPKvjTg': ['Oberkörper', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/acp77RhVzMM': ['Oberkörper', 'Fitnessstudio'],
            'https://www.youtube.com/embed/hpwIMIr-N3g': ['Oberkörper', 'Fitnessstudio'],

            // Unterkörper, Legs, Beinmuskulatur
            'https://www.youtube.com/embed/zxyxzK_w68I': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/bcH-qcnpy20': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/d-8tlYmfbDs': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/DQQP29pidfY': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/vK_DQYimccw': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/4RJANBzEMN4': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/KKWuBV_H8Es': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Fitnessstudio'],
            'https://www.youtube.com/embed/H6mRkx1x77k': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Fitnessstudio'],
            'https://www.youtube.com/embed/kIXcoivzGf8': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Fitnessstudio'],
            'https://www.youtube.com/embed/8zWDuWKdBZU': ['Unterkörper', 'Beinmuskulatur', 'Legs', 'Fitnessstudio'],

            // Schultermuskulatur
            'https://www.youtube.com/embed/I0YCSRlKR-M': ['Schultermuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/4JZxm_qJPUc': ['Schultermuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/w8cSjkXkYRc': ['Schultermuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/SgyUoY0IZ7A': ['Schultermuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/21lYP86dHW4': ['Schultermuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/boUVD0pCGCk': ['Schultermuskulatur', 'Fitnessstudio'],

            // Brustmuskulatur
            'https://www.youtube.com/embed/fX5AbAPH37g': ['Brustmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/aJVqGwHMias': ['Brustmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/ZXSHhDulDkM': ['Brustmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/oo-aga3rAWs': ['Brustmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/fGm-ef-4PVk': ['Brustmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/ChDeUAJc9bE': ['Brustmuskulatur', 'Fitnessstudio'],

            // Armmuskulatur
            'https://www.youtube.com/embed/ZNQC_Dzr10U': ['Armmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/tuxW0oWrzkU': ['Armmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/66ukErqqC2I': ['Armmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/8Tdk6k3TBpk': ['Armmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/k8mkr459wA8': ['Armmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/GNO4OtYoCYk': ['Armmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/OpRMRhr0Ycc': ['Armmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/CLccU7tk7es': ['Armmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/8Nkfuhxsl-0': ['Armmuskulatur', 'Fitnessstudio'],

            // Bauchmuskulatur
            'https://www.youtube.com/embed/UYWBfKXPJvA': ['Bauchmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/lno9GbdrVh4': ['Bauchmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/84EkBBwJc3A': ['Bauchmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/Q-vuR4PJh2c': ['Bauchmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/bxJAKe4NS4w': ['Bauchmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/8AwCCgGBpHA': ['Bauchmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/KSYTgBO0ClI': ['Bauchmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/fg-Fp5o-_ws': ['Bauchmuskulatur', 'Fitnessstudio'],

            // Rückenmuskulatur
            'https://www.youtube.com/embed/ExDNiC5aVQM': ['Rückenmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/x0UKQEG-mi4': ['Rückenmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/25fxE9VrmPs': ['Rückenmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/ptc6PhnXAxI': ['Rückenmuskulatur', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/jLvqKgW-_G8': ['Rückenmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/zgfcOWuTeYA': ['Rückenmuskulatur', 'Fitnessstudio'],
            'https://www.youtube.com/embed/fX36liNtKzw': ['Rückenmuskulatur', 'Fitnessstudio'],

            // Push
            'https://www.youtube.com/embed/sa6MQCNNZ3o': ['Push', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/Jf5_PJCFs-g': ['Push', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/9DQ2W3F1FuQ': ['Push', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/KzzDuNu1Y7U': ['Push', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/b6ouj88iBZs': ['Push', 'Fitnessstudio'],
            'https://www.youtube.com/embed/NGGbHbY0sN8': ['Push', 'Fitnessstudio'],
            'https://www.youtube.com/embed/HE45jVN7XKM': ['Push', 'Fitnessstudio'],

            // Pull
            'https://www.youtube.com/embed/nyGKB_lhnvc': ['Pull', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/AyODqSptjGw': ['Pull', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/DUoBNd9yG4Q': ['Pull', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/hMKjSCJQHFE': ['Pull', 'Zuhause_mit_Gewichte'],
            'https://www.youtube.com/embed/DXL18E7QRbk': ['Pull', 'Fitnessstudio'],
            'https://www.youtube.com/embed/IOl42YpK_Es': ['Pull', 'Fitnessstudio'],
            'https://www.youtube.com/embed/CGzCjBDttDk': ['Pull', 'Fitnessstudio']
        };

        // Filtere die Videos basierend auf der Auswahl
        const filteredVideos = Object.entries(videos).filter(([link, tags]) => {
            return tags.includes(selectedCategory) && tags.includes(selectedLocation);
        });

        // Zeige die gefilterten Videos an
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = '';

        filteredVideos.forEach(([link, tags]) => {
            const iframe = document.createElement('iframe');
            iframe.src = link;
            iframe.width = '560';
            iframe.height = '315';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            videoContainer.appendChild(iframe);
        });
        // Automatisch zum Video-Container scrollen
        videoContainer.scrollIntoView({ behavior: 'smooth' }); // Sanftes Scrollen
    });
});