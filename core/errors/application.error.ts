export class ApplicationError extends Error {
    /**
     *
     */
    constructor(message: string) {
        super(message);
    }

    public get Message(): string { return this.message}
}