import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';


// overall used infix to postix conversion and then evaluated that postix expression to get the final result
// Time Complexity : O(n)
// Space Complexity : O(n);
@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression: string = calcBody.expression;

    if (!this.isValidExpression(expression)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
    // convert expression from infix to postfix
    const postfixExpression:string= this.infixToPostfix(expression);

    // evalute the postfix expression
    const result:number = this.evaluatePostfixExpression(postfixExpression);

    // return the calculated output
    return result;
  }
  
  

  // function to evaluate postfix expression
  evaluatePostfixExpression(expression:string):number {
    let stack:Array<number>=[];
    let i=0;

    while(i<expression.length) {
      if (expression[i]===' ') {
        i++;
        continue;
      }

      if(!this.isOperator(expression[i])){
        let num ='';
        while(i<expression.length && !this.isOperator(expression[i]) && expression[i]!==' '){
          num += expression[i];
          i++;
        }
        stack.push(parseFloat(num));
      }else{
        let value1:number = stack.pop();
        let value2:number = stack.pop();
        switch(expression[i]){
          case '+':
            stack.push(value2 + value1);
            break;
          case '-':
            stack.push(value2 - value1);
            break;
          case '*':
            stack.push(value2 * value1);
            break;
          case '/':
            stack.push(value2 / value1);
            break;
        }
        i++;
      }
    }
    return stack.pop();
  }


  // function to convert infix expressions to postfix expressions
  infixToPostfix(expression: string): string {
    let stack: Array<string>=[];
    let postfix: Array<string>=[];
    let i:number=0;

    while(i<expression.length){
      if (expression[i]===' ') {
        i++;
        continue;
      }

      if(!this.isOperator(expression[i]) && expression[i]!=='(' && expression[i]!==')'){
        let num= '';
        while(i< expression.length && !this.isOperator(expression[i])&&expression[i]!=='('&&expression[i]!==')' && expression[i]!== ' '){
          num += expression[i];
          i++;
        }
        postfix.push(num);
        postfix.push(' ');
      }else if(expression[i]==='('){
        stack.push(expression[i]);
        i++;
      }else if(expression[i]===')'){
        while(stack.length && stack[stack.length - 1]!== '('){
          postfix.push(stack.pop());
          postfix.push(' ');
        }
        stack.pop(); // Remove '(' from stack
        i++;
      }else{
        while(stack.length && this.hasPrecedence(expression[i])<=this.hasPrecedence(stack[stack.length - 1])){
          postfix.push(stack.pop());
          postfix.push(' ');
        }
        stack.push(expression[i]);
        i++;
      }
    }

    while(stack.length!==0){
      postfix.push(stack.pop());
      postfix.push(' ');
    }

    return postfix.join('').trim();
  }


  // validate if expression is valid or not
  isValidExpression(expression:string):boolean{
    let stack: Array<string>=[];
    let previousChar:string ='';

    for(const char of expression){
      if(char==='(') {
        stack.push(char);
      }else if(char===')'){
        if (stack.pop()!=='(') {
          return false;
        }
      }else if('+-*/'.includes(char)){
        if (!previousChar || '+-*/'.includes(previousChar) || previousChar==='(') {
          return false;
        }
      }else if(!/\s|\d/.test(char)){
        return false;
      }
      previousChar = char;
    }

    return stack.length === 0 && !'+-*/'.includes(previousChar);
  }


  // check if char is operator or not
  isOperator(char: string):boolean{
    return "+-/*".includes(char);
  }


  // precedence of char function
  hasPrecedence(char:string):number {
    if(char==='*' || char==='/') {
      return 2;
    }
    if(char==='+' || char==='-') {
      return 1;
    }
    return 0;
  }
}
