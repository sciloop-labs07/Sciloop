using UnityEngine;

[RequireComponent(typeof(Collider))]
public class EnergyParticle : MonoBehaviour
{
    [SerializeField] private float energyValue = 25f;
    [SerializeField] private float respawnRadius = 6f;
    [SerializeField] private bool isActive = true;

    private float pulse;
    private Collider triggerCollider;

    public bool IsActive => isActive;

    public void Initialize(float value, float radius)
    {
        energyValue = Mathf.Max(1f, value);
        respawnRadius = Mathf.Max(1f, radius);
        isActive = true;
        pulse = Random.Range(0f, Mathf.PI * 2f);
        triggerCollider = GetComponent<Collider>();
        triggerCollider.isTrigger = true;
    }

    public float Consume()
    {
        if (!isActive) return 0f;
        var value = energyValue;
        Respawn();
        return value;
    }

    private void Update()
    {
        pulse += Time.deltaTime * 3.2f;
        var scale = 0.18f + Mathf.Sin(pulse) * 0.035f;
        transform.localScale = Vector3.one * scale;
        transform.Rotate(Vector3.up, 45f * Time.deltaTime, Space.World);
    }

    private void Respawn()
    {
        var circle = Random.insideUnitCircle * respawnRadius;
        transform.position = new Vector3(circle.x, 0.35f, circle.y);
    }
}
