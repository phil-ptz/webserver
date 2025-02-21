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
            'https://www.youtube.com/embed/abc123': ['Ganzkörper', 'Fitnessstudio'],
            'https://www.youtube.com/embed/xyz456': ['Beinmuskulatur', 'Zuhause_ohne_Gewichte'],
            'https://www.youtube.com/embed/def789': ['Oberkörper', 'Zuhause_mit_Gewichten'],
            'https://www.youtube.com/embed/ghi101': ['Unterkörper', 'Fitnessstudio'],
            'https://www.youtube.com/embed/jkl202': ['Push', 'Zuhause_mit_Gewichten'],
            'https://www.youtube.com/embed/mno303': ['Pull', 'Fitnessstudio'],
            'https://www.youtube.com/embed/pqr404': ['Legs', 'Zuhause_ohne_Gewichte'],
            // Füge hier weitere Videos hinzu
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
    });
});