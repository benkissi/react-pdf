const scripts = [
    {
      name: 'html2pdf',
      src: 'html2pdf.bundle.min.js',
    }
  ];
  
  const assets = {};
  window.getAsset = (scriptName) => assets[scriptName];
  
  export default function prepareAssets() {
    // prepare scripts
    scripts.forEach(({ name, src }) => {
      assets[name] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          resolve(window[name]);
          console.log(`${name} is loaded.`);
        };
        script.onerror = () =>
          reject(`The script ${name} didn't load correctly.`);
        document.body.appendChild(script);
      });
    });
  }