using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class AgentAI : MonoBehaviour
{
    [SerializeField] private float currentEnergy = 62f;
    [SerializeField] private float moveSpeed = 1.2f;
    [SerializeField] private float worldRadius = 6f;
    [SerializeField] private bool isAlive = true;

    private SciLoopUnityBridge bridge;
    private Rigidbody body;
    private Vector3 wanderTarget;
    private float nextWanderTime;

    public float CurrentEnergy => currentEnergy;
    public bool IsAlive => isAlive;

    public void Initialize(SciLoopUnityBridge owner, float speed, float startingEnergy, float radius)
    {
        bridge = owner;
        moveSpeed = Mathf.Clamp(speed, 0.05f, 12f);
        currentEnergy = Mathf.Clamp(startingEnergy, 0f, 100f);
        worldRadius = Mathf.Max(1f, radius);
        isAlive = currentEnergy > 0f;
        body = GetComponent<Rigidbody>();
        PickWanderTarget();
    }

    public void SetSpeed(float speed)
    {
        moveSpeed = Mathf.Clamp(speed, 0.05f, 12f);
    }

    public void SetStartingEnergy(float energy)
    {
        if (!isAlive) return;
        currentEnergy = Mathf.Clamp(energy, 0f, 100f);
    }

    private void FixedUpdate()
    {
        if (!isAlive || bridge == null) return;

        currentEnergy = Mathf.Clamp(currentEnergy - Time.fixedDeltaTime * (0.18f + moveSpeed * 0.06f), 0f, 100f);
        if (currentEnergy <= 0f)
        {
            Die();
            return;
        }

        var target = FindNearestEnergyParticle(bridge.GetResources());
        var targetPosition = target != null ? target.transform.position : wanderTarget;
        var direction = targetPosition - transform.position;
        direction.y = 0f;

        if (direction.sqrMagnitude > 0.01f)
        {
            body.AddForce(direction.normalized * moveSpeed * 2.8f, ForceMode.Acceleration);
        }

        AvoidWalls();

        if (Time.time >= nextWanderTime || Vector3.Distance(transform.position, wanderTarget) < 0.6f)
        {
            PickWanderTarget();
        }
    }

    private EnergyParticle FindNearestEnergyParticle(List<EnergyParticle> resources)
    {
        EnergyParticle nearest = null;
        var nearestDistance = float.MaxValue;
        foreach (var resource in resources)
        {
            if (resource == null || !resource.IsActive) continue;
            var distance = Vector3.Distance(transform.position, resource.transform.position);
            if (distance < nearestDistance)
            {
                nearestDistance = distance;
                nearest = resource;
            }
        }
        return nearestDistance < worldRadius * 1.4f ? nearest : null;
    }

    private void AvoidWalls()
    {
        var flat = new Vector3(transform.position.x, 0f, transform.position.z);
        if (flat.magnitude < worldRadius * 0.88f) return;
        body.AddForce(-flat.normalized * moveSpeed * 4f, ForceMode.Acceleration);
    }

    private void PickWanderTarget()
    {
        var circle = Random.insideUnitCircle * worldRadius;
        wanderTarget = new Vector3(circle.x, transform.position.y, circle.y);
        nextWanderTime = Time.time + Random.Range(1.0f, 2.8f);
    }

    private void OnTriggerEnter(Collider other)
    {
        var particle = other.GetComponent<EnergyParticle>();
        if (particle == null || !particle.IsActive) return;
        currentEnergy = Mathf.Clamp(currentEnergy + particle.Consume(), 0f, 100f);
    }

    private void OnCollisionEnter(Collision collision)
    {
        bridge?.RegisterCollision();
    }

    private void Die()
    {
        isAlive = false;
        body.velocity *= 0.1f;
        var renderer = GetComponent<Renderer>();
        if (renderer != null)
        {
            renderer.material.color = new Color(1f, 0.32f, 0.32f, 0.22f);
        }
    }
}
