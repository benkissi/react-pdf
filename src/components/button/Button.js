import React from "react";

import styles from './Button.module.css'

function Button({
  text = "Button text here",
  disabled,
  click,
}) {
  return (
    <button disabled={disabled} onClick={click} className={styles.button}>
      {text}
    </button>
  );
}

export default Button;
