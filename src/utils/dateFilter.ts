export type FilterPreset = 'hari-ini' | 'minggu-ini' | 'bulan-ini' | 'semua';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function filterByDatePreset<T>(
    items: T[],
    preset: FilterPreset,
    getDate: (item: T) => string
) : T[] {

    if (preset === 'semua') return items

    const now = new Date();

    return items.filter((item) => {
        const itemDate = new Date(getDate(item));
        const elapsed = now.getTime() - itemDate.getTime()

        if (preset === 'hari-ini'){
            return (
                itemDate.getDate() === now.getDate() &&
                itemDate.getMonth() === now.getMonth() &&
                itemDate.getFullYear() === now.getFullYear()
            );
        }

        if (preset === 'minggu-ini') {
            return (
                elapsed <= (ONE_DAY_MS * 7)
            );
        }

        if (preset === 'bulan-ini') {
            return (
                itemDate.getMonth() === now.getMonth() &&
                itemDate.getFullYear() === now.getFullYear()
            )
        }
    })
}