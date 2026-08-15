import styles from "./pages.module.css"

export default function NotFoundPage() {
  return (
    <div className={styles.nfContainer}>
      <p className={styles.nfCode}>404</p>
      <h1 className={styles.nfTitle}>Página no encontrada</h1>
      <p className={styles.nfSubtitle}>La ruta que buscas no existe.</p>
      <a href="/" className={styles.nfLink}>
        Volver al inicio
      </a>
    </div>
  )
}
