
'use client';

interface YouTubeEmbedProps {
    videoUrl: string;
}

export function YouTubeEmbed({ videoUrl }: YouTubeEmbedProps) {
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return null;
        }
    }
    
    const videoId = getYouTubeId(videoUrl);

    if (!videoId) {
        return <p className="text-destructive text-center">Invalid YouTube URL provided.</p>
    }

    return (
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </div>
    );
}
