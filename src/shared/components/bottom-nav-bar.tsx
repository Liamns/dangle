import Image from "next/image";
import styles from "../styles/bottom-nav-bar.module.scss";
import Link from "next/link";
import HomeIcon from "@/shared/svgs/home.svg";
import ScheduleIcon from "@/shared/svgs/schedule.svg";
import ProfileIcon from "@/shared/svgs/profile.svg";
import RoutineIcon from "@/shared/svgs/routine.svg";
import FavoritesIcon from "@/shared/svgs/favorites.svg";

export default function BottomNavBar() {
  const navItems = [
    {
      href: "/home",
      label: "홈",
      icon: <HomeIcon />,
    },
    {
      href: "/schedule",
      label: "일정",
      icon: <ScheduleIcon />,
    },
    {
      href: "/profile",
      label: "프로필",
      icon: <ProfileIcon />,
    },
    {
      href: "/routine",
      label: "루틴",
      icon: <RoutineIcon />,
    },
    {
      href: "/favorites",
      label: "즐겨찾기",
      icon: <FavoritesIcon />,
    },
  ];

  return (
    <div className={styles.container}>
      {navItems.map(({ href, icon, label }, idx) => {
        return (
          <Link key={idx} href={href} style={{ height: "100%" }}>
            <div className={styles.iconContainer}>
              {icon}
              <span className={styles.label}>{label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
