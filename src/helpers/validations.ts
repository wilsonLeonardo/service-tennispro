export function validations(obrigatorios, objeto) {
  const camposObejo = Object.keys(objeto);
  const invalidos = [];

  obrigatorios.forEach(campo => {
    if (!camposObejo.includes(campo)) {
      invalidos.push(campo);
    }

    if (camposObejo.includes(campo) && objeto[campo] === '') {
      invalidos.push(campo);
    }
  });

  return {
    valid: !!invalidos.length,
    campos: invalidos.join(','),
  };
}
