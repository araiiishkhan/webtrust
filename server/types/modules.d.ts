// Type declarations for modules without declaration files

declare module 'whois-json' {
  export default function lookup(domain: string): Promise<any>;
}

declare module 'dns-lookup' {
  export function lookup(domain: string, callback: (err: any, address: string) => void): void;
}

declare module 'psl' {
  export function parse(domain: string): {
    domain: string | null;
    subdomain: string | null;
    tld: string | null;
  };
}
