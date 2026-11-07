// Type declarations for Next.js in Vite/Next.js isomorphic setup

declare module 'next/server' {
  export class NextResponse extends Response {
    static json<T = any>(body: T, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: any): NextResponse;
  }
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<{
      href: string;
      children?: React.ReactNode;
      className?: string;
      [key: string]: any;
    }> & React.RefAttributes<HTMLAnchorElement>
  >;
  export default Link;
}
