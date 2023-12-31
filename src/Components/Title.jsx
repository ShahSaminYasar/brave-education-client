const Title = ({ children, className }) => {
  return (
    <h2 className={`block text-left text-[22px] xs:text-[25px] sm:text-[28px] text-slate-800 font-[500] mb-3 ${className && className}`}>
      {children}
    </h2>
  );
};
export default Title;
