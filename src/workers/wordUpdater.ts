export class WordUpdater {
    private intervalID: NodeJS.Timer | null = null;

    public init(seconds: number){
        if(!this.intervalID) this.startInterval(seconds);
    }

    public stop(){
        clearInterval(this.intervalID || 0);
        this.intervalID = null;
    }

    private async startInterval(seconds: number){
        await this.UpdateCurrentWord();
        this.intervalID = setInterval(async () => {
            await this.UpdateCurrentWord();
        }, seconds*1000)
    }

    private async UpdateCurrentWord(){
        console.log('Select a new word');
        
    }
}

export default new WordUpdater();