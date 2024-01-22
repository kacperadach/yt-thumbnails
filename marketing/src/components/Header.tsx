interface HeaderProps {
  blogHref: string;
  loginHref: string;
}

export default function Header(props: HeaderProps) {
  const { blogHref, loginHref } = props;

  return (
    <div className="flex justify-between mx-2 pt-2">
      <div
        style={{
          width: "4rem",
          height: "auto",
        }}
      >
        <a href="/">
          <img src="/logo.png" alt="logo" className="w-full h-full" />
        </a>
      </div>
      <div className="flex mr-2">
        <div className="m-2" style={{ height: "fit-content" }}>
          <a
            className="hover:text-brand hover:border-brand no-underline font-bold text-lg border-b-2"
            href="/pricing"
          >
            Pricing
          </a>
        </div>
        <div className="m-2" style={{ height: "fit-content" }}>
          <a
            className="hover:text-brand hover:border-brand no-underline font-bold text-lg border-b-2"
            href={blogHref}
          >
            Blog
          </a>
        </div>
        <div className="m-2" style={{ height: "fit-content" }}>
          <a
            className="no-underline font-bold text-lg bg-brand p-2 rounded hover:bg-white hover:text-brand border-brand border-2 "
            href={loginHref}
          >
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
