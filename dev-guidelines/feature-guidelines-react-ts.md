// Example of proper memoization
function ExpensiveComponent({ data, onItemClick }: Props) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcess(item));
  }, [data]);
  
  // Memoize callback to prevent unnecessary re-renders
  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// Prevent re-renders when props don't change
export default React.memo(ExpensiveComponent);
