const MOCK_DELAY = 150;

export function delay(ms = MOCK_DELAY): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
