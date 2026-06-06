import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Workbench", detail: "决策总览与 featured event" },
  { href: "/alerts", label: "Alerts", detail: "待推预警与最新触发原因" },
  { href: "/connectors", label: "Connectors", detail: "配置真实数据源与 provider 参数" },
  { href: "/future-destinations", label: "Future", detail: "未来旅行更优的目标仓库" },
  { href: "/profile", label: "Profile", detail: "约束条件、life list 与偏好" },
  { href: "/archive", label: "Archive", detail: "推后复盘与归档记录" }
];

export function Shell({
  activePath,
  children
}: {
  activePath: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">BIRD / Twitcher Mode</span>
          <h1>BIRD</h1>
          <p>Birding Intelligent Route Designer</p>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              data-active={activePath === item.href}
            >
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
