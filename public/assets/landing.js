document.addEventListener("DOMContentLoaded", function() {
    setTimeout(()=>{
        const text = "\"Embracing Nature's Rhythm with Intuitive Plant Disease Discovery\"";
        const subhead = document.getElementById("subheading");
        const wrapper = document.getElementById("main");
        wrapper.classList.add("show");
        setTimeout(()=>{typeSentence(text, subhead)}, 2000)
    }, 1500)

});

async function typeSentence(sentence, eleRef, delay = 100) {
    const letters = sentence.split("");
    let i = 0;
    while(i < letters.length) {
      await waitForMs(delay);
      $(eleRef).append(letters[i]);
      i++
    }
    return;
  }
  
  
  function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }