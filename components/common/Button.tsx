import { JSX } from "preact";

export function Button(props:{ addClass?:string }&JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`
      select-none
      text-2xl
      text-[#3d3d3d]
      dark:text-[#d7d7d7]
      text-center w-[180px]
      shadow-lg font-[Poppins]
      rounded-lg
      ${props.disabled ? '' : 'hover:scale-[102%]'}
      ${props.disabled ? '' : 'active:scale-[98%]'}
      ${props.disabled ? 'contrast-[75%]' : ''}
      border
      border-[#e9e9e9]
      dark:border-[#ffffff1f]
      ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      dark:bg-[#191919]
      bg-[#f1f1f1]
        ${props.addClass}
      `}
    />
  );
}