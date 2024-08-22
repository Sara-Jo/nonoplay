import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.logoContainer}>
        <Image
          src="/logo.png"
          alt="image"
          layout="responsive"
          width={800}
          height={800}
          className={styles.logo}
        />
      </div>
    </div>
  );
}
