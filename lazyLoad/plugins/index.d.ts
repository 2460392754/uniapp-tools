interface configArgs {
    loading: {
        type: string,
        name: string
    },
    error: {
        type: string,
        name: string
    },
    preLoadNum?: number,
    intervalTime?: number,
    minLoadAnimeTime?: number,
    throttleTime?: numner,
    animeSwitchTime?: number,
    everyLoadQuantity?: numner,
    debug?: boolean
}

interface InitArgs {
    id: string,
    horizontal?: boolean,
    context?: object
}

interface onArgs {
    id: string,
    guid: string,
    context?: any,
    fn: function
}

class App {
    init(args: InitArgs): void
    scroll(): void
    getConfig(): configArgs
    setScrollId(id: string): void
    on(args: onArgs): void
    destroy(id: string): void
}

declare const LazyLoad = new App();

export default LazyLoad