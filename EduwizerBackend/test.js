const some = (n) => {
  try {
    const array = [];
    let rows = n;
    let cols = n * 2 - 1;
    let t1 = n;
    let t2 = n;
    for (let row = 0; row < rows; row++) {
      let tempStr = "";
      for (let startNumber = 0; startNumber < row; startNumber++) {
        tempStr += t2 - startNumber;
      }
      for (let col = row; col < cols; col++) {
        tempStr += t1;
      }
      t1 -= 1;
      let t3 = n - row;
      for (let endNumber = 0; endNumber < row; endNumber++) {
        tempStr += t3 + endNumber + 1;
      }
      cols -= 1;
      array.push(tempStr);
    }

    for (let index = array.length; index > 0; index--) {
      if (index != array.length) {
        array.push(array[index - 1]);
      }
    }
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      console.log(element);
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
};

some(7);

