# Newton's Method of Root Finding
One method to approximate the root of a function is using the roots of tangent lines as the next starting point for the next tangent line in series. 
Newton came up with this along with this recursive function:

$$
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
$$

This method beats the Bisection Method in terms of efficiency and personally, I prefer to use instead. I thought it would be interesting to
visualize this with programming and this project is just that!

## Tech Stack
- Typescript
- HTML/CSS

## Demo
<img width="1435" height="696" alt="Screenshot 2026-04-29 at 1 51 13 PM" src="https://github.com/user-attachments/assets/71f480c5-8624-4abe-98df-cbe96b39bf12" />

To use this, just update the parameters for graphing purposes and then click on the `plot` button to see the final result!

## Installation
1.) Clone this Repo  
2.) Run `npm install` in the terminal  
3.) Run `npm run dev` in the terminal  
