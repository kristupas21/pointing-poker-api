export function createWSTopic(sessionId: string): string {
    return `pp.session.${sessionId}`;
}
