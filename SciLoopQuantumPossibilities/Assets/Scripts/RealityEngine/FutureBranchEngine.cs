using UnityEngine;

namespace SciLoop.RealityEngine
{
    public class FutureBranchEngine : MonoBehaviour
    {
        private RealityBranch[] branches;

        public void LoadBranches(RealityBranch[] futureBranches)
        {
            branches = futureBranches ?? new RealityBranch[0];
            Debug.Log($"Loaded {branches.Length} SciLoop future branches.");
        }

        public void SelectBranch(int index)
        {
            if (branches == null || branches.Length == 0) return;
            var branch = branches[Mathf.Clamp(index, 0, branches.Length - 1)];
            Debug.Log($"Selected future branch: {branch.title}");
        }
    }
}
