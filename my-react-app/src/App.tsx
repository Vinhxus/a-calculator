import { useState } from "react"



function App() {
  const [result, setResult] = useState<string>('')
  const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2 };

  function handleDigitClick(digit: string){
    console.log(JSON.stringify(result), typeof result);
    if (result == 'Error') {
      setResult(digit);
      return;
    }
    setResult(prev => prev + digit) // khong dung result + digit vi result la state, khi setResult se bi loi khi nhieu lan click lien tiep
  }

  function handleOperatorClick(op: string){
    if (result == 'Error') {
      setResult(op);
      return;
    }
    if (result.length && result[result.length - 1] in PRECEDENCE) {
      setResult( prev => prev.slice(0,prev.length-1) + op ) ;
      return;
    }
    setResult( prev => prev + op);
  }

  function handleDot(){
    if (result == 'Error' || result == "") {
      setResult("0.");
      return;
    }
    setResult(prev => (prev.includes(".") ? prev : prev + "."));
  }
  
  function handleDel(){
    if (result == 'Error') {
      setResult("");
      return;
    }
    if (!result.length) return;
    setResult(prev => prev.slice(0, prev.length-1));
  }

  function handleAc(){
    setResult("")
  }

  function tokenize(token : string){
    const tokens = [];
    let num = "";
    for (let i = 0; i < token.length; i++) {
      const ch = token[i];

      if (/[0-9.]/.test(ch)) {
        num += ch;
        continue;
      }

      const prev = tokens[tokens.length - 1];

      const isUnaryMinus =
        ch === "-" && num === "" && (prev === undefined || prev in PRECEDENCE || prev === "(");

      if (isUnaryMinus) {
        num = "-";
        continue;
      }
      
      if (
        ch in PRECEDENCE &&
        (num === "" || num === "-") &&
        prev !== undefined &&
        prev in PRECEDENCE
      ) {
        num = "";                          
        tokens[tokens.length - 1] = ch;    // thay ptu cuối
        continue;
      }

      if (num !== "") {
        tokens.push(num);
        num = "";
      }
      if (ch in PRECEDENCE || ch === "(" || ch === ")") tokens.push(ch);
    }

    if (num !== "") tokens.push(num);
    
    return tokens;
  }

  function toPostfix(tokens: string[]) : string[]{
    const rs: string[] = [];  // output postfix
    const ops: string[] = [];  // operators' stack

    for (const t of tokens){
        if (t in PRECEDENCE){
            while ( ops.length && ops[ops.length - 1] in PRECEDENCE && PRECEDENCE[ops[ops.length - 1]] >= PRECEDENCE[t]){
                rs.push(ops.pop()!);
            }
            ops.push(t);
        } else {
        rs.push(t);
        }
    }
    while (ops.length) rs.push(ops.pop()!); 
    return rs;
  }

  function compute(pos: string){
    const stack : number[] = [];
    for (const t of pos){
      if (t in PRECEDENCE){
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error("Not valid!");
        switch (t) {
          case "+": stack.push(a + b); break;
          case "-": stack.push(a - b); break;
          case "*": stack.push(a * b); break;
          case "/": 
            if (b === 0) throw new Error("Chia cho 0");
            stack.push(a/b);
            break;
        }
      } else {
        stack.push(parseFloat(t));
      }
    }

    if (stack.length !== 1) throw new Error("Biểu thức không hợp lệ");
    return stack[0];
  }

  function handleEqualClick() {
    try {
      const value = compute(toPostfix(tokenize(result)));
      setResult(String(Number(value.toFixed(10))));
    } catch {
      setResult("Error");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-r from-blue-900 via-amber-50 to-blue-950 ">
      <div className="calculator-grid border w-60 h-max mt-10 bg-amber-50">
        <div className="bg-[#ebe8d0] min-h-12 h-max w-full flex flex-col gap-1 p-2 break-words">
          <span className="text-3xl text-end w-full">
            {result}
          </span>
        </div>
        <div className="grid grid-cols-4 grid-rows-5 w-full h-full gap-0.5">
            <button 
              className="col-span-2 border rounded px-2 py-2 cursor-pointer"
              onClick= {() => handleAc()}
            >
              AC
            </button>
            <button 
              className="border rounded px-2 py-2 cursor-pointer"
              onClick= { () => handleDel()}
            >
              del
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleOperatorClick('/')}>
              /
            </button>
            <button 
              className="border rounded px-2 py-2 cursor-pointer"
              onClick= {() => handleDigitClick('1')}
            >
              1
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('2')}>
              2
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('3')}>
              3
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick={ () => handleOperatorClick('*')}>
              *
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('4')}>
              4
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('5')}>
              5
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('6')}>
              6
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick={ () => handleOperatorClick('+')}>
              +
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('7')}>
              7
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('8')}>
              8
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('9')}>
              9
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick={ () => handleOperatorClick('-')}>
              -
            </button>
            <button 
              className="border rounded px-2 py-2 cursor-pointer"
              onClick = { () => handleDot() }
            >
              .
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer" onClick= {() => handleDigitClick('0')}>
              0
            </button>
            <button className="border rounded px-2 py-2 cursor-pointer col-span-2" onClick = {()=> handleEqualClick() }>
              =
            </button>
        </div>
      </div>
    </div>
  )
}

export default App