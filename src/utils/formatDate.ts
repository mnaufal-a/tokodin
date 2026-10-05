export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return  date.toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    });
}

export function formatDateShort(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
        day: "numeric", month: 'short',
        timeZone: 'Asia/Jakarta',
    })
}

export function formatRelativeTime(isoString: string): string {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

    if (diffMinutes < 1) {
        return 'Baru Saja'
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} mnt lalu`
    }

    if (diffHours < 24) {
        return `${diffHours} jam lalu`
    }

    //lebih 1 hari pake tanggal b aj
    return formatDate(isoString);

}