import { FixedSizeList as List } from 'react-window';

const TaskList = ({ tasks }) => {
  const Row = ({ index, style }) => {
    const task = tasks[index]; // Obtenez la tâche par index
    return (
      <div style={style} className="task-row">
        {task ? (
          <div>
            <h3>{task.libelle}</h3>
            {/* Ajoutez d'autres détails si nécessaire */}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <List
      height={400} // Hauteur de la zone visible
      itemCount={tasks.length} // Nombre de tâches
      itemSize={35} // Hauteur de chaque tâche
      width="100%" // Largeur de la liste
    >
      {Row} {/* Rendu de chaque ligne */}
    </List>
  );
};

export default TaskList;