# Local Platform Port Allocation

These ports are reserved for the sibling local platforms. Launchers should
check their assigned ports instead of claiming any listening port as their
own.

| Platform | Frontend | Backend / services |
| --- | ---: | --- |
| PX | 3000 | 8000 |
| Denver OS | 3002 | platform-specific |
| AGI OS | 3003 | same Next process |
| SciLoop main | 3010 | ForLoop API 3001, SciLoop AI 5050 |

SciLoop uses `3010` deliberately so its frontend does not compete with PX,
Denver OS, or AGI OS. The existing manual launchers remain available for
rollback and troubleshooting.
