
export function ToHex(num: number): string {
    if (num < 0) {
        return 'N/A';
    }

    return '0x' + num.toString(16).toUpperCase();
}

export function ToBytes(num: number): string {
    if (num < 0) {
        return 'N/A';
    }

    let i = 0;
    while (num > 1024) {
        num /= 1024;
        i++;
    }

    return `${num.toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i]}`;
}

export function SelectColor(index: number, maxIndex: number) {
    if (maxIndex < 1) maxIndex = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (index * (360 / maxIndex) % 360) + ",100%,50%)";
}

export function GenerateCSV(header: string[], data: string[][]) {
    const table = [header, ...data];
    const sizes = table.map((row) => row.map((col) => col.length));

    for (let i = 1; i < header.length; i++) {
        const col = table.map((row) => row[i]);
        const prev = sizes.map((row) => row[i - 1]);

        const colSize = Math.max(...prev) + 1;

        for (let j = 0; j < table.length; j++) {
            const str = col[j];
            table[j][i] = str.padStart(str.length + (colSize - prev[j]));
        }
    }

    return table.map((row) => row.join(',')).join('\n');
}