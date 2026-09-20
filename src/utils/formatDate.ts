export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return  date.toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    });
}