
const Course = ( {course} ) => {
  return(
    <div>
      <Header name={course.name} />
      <Content parts={course.parts}  />
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = ( {name} ) => {
  return(
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Content  = ( {parts} ) => {
  return(
    <>
      {parts.map(part => 
        <Part key={part.id} part={part.name} exercises={part.exercises}/>
      )}
    </>
  )
}

const Part = ( {part, exercises} ) => {
  return(
    <p>
      {part} {exercises}
    </p>
  )
}

const Total = ( {parts} ) => {

  const total = parts.reduce((s, p) => s + p.exercises, 0)  
  return(
    <div>
      <b>total of {total} exercises</b>
    </div>
  )
}


export default Course
