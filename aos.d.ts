declare module "aos" {
  interface AosOptions {
    duration?: number;
    delay?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    offset?: number;
  }

  interface AosApi {
    init: (options?: AosOptions) => void;
    refresh: () => void;
    refreshHard: () => void;
  }

  const AOS: AosApi;

  export default AOS;
}
