

const buttons = document.getElementsByClassName('.col');
console.log(buttons)



document.addEventListener('DOMContentLoaded', () => {

  const buttons = document.getElementsByClassName('col');
  let buttonText = '';

  Array.from(buttons).forEach(button => {
    button.addEventListener('click', () => {

      Array.from(buttons).forEach(btn => btn.classList.remove('selected'));


      button.classList.add('selected');


      buttonText = button.innerText;


      console.log('Botão selecionado:', buttonText);


      const botaoSelecionado = buttonText;
      console.log('Variável botaoSelecionado:', botaoSelecionado);

      document.querySelector('.cadeira-escolhida').textContent = buttonText
    });
  });

  const btnNext = document.getElementById('btn-next');
  btnNext.addEventListener('click', () => {
    if (buttonText == '') {
      alert('Por favor escolha sua cadeira')
      if (btnNext.hasAttribute('data-bs-toggle') && btnNext.hasAttribute('data-bs-target')) {
        // Removendo os atributos "data-bs-toggle" e "data-bs-target" do botão "btn-next"
        btnNext.removeAttribute('data-bs-toggle');
        btnNext.removeAttribute('data-bs-target');
      }
    }
    else {
      btnNext.setAttribute('data-bs-toggle', 'modal');
      btnNext.setAttribute('data-bs-target', '#exampleModal');
    }
  });
});

