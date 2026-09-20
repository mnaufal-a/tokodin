import { IS_DEMO_BUILD } from "../config";
import { seedChatHistory } from "../data/seedData";
import { API_BASE_URL, API_KEY } from "../config/secret";


export interface ChatLog {
    Timestamp: string,
    phoneNumber: string,
    customerName: string,
    messageIn: string,
    messageOut: string,
}

export async function getChatHistory(): Promise<ChatLog[]> {

    if (IS_DEMO_BUILD) {
        return seedChatHistory;
    }

    const response = await fetch(`${API_BASE_URL}/webhook/get-chat-history`, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Gagal mengambil riwayat chat!');
    }

    const data = await response.json()
    return data.chatlogs;
}